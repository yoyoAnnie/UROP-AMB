# Install/Load required packages
if(!require(RWiener)) install.packages("RWiener")
if(!require(R2jags)) install.packages("R2jags")
library(RWiener)
library(R2jags)

set.seed(2026) # For reproducibility

num_subs <- 200
trials_per_sub <- 100 # Keep it manageable for the first run

# Create storage for 'True' parameters so we can check them later
true_alpha <- runif(num_subs, 2.0, 3.0)
true_tau   <- runif(num_subs, 0.1, 0.5)
true_beta  <- runif(num_subs, 0.4, 0.6)
true_delta <- runif(num_subs, 0.5, 1.5)

# Matrix to hold Response Times (RTs)
# Note: In JAGS dwiener, Choice is encoded by the sign of RT 
# (Positive = Upper Boundary/Lottery, Negative = Lower Boundary/Safe)
s_RT <- matrix(NA, nrow = num_subs, ncol = trials_per_sub)

for (i in 1:num_subs) {
  for (j in 1:trials_per_sub) {
    # Generate one DDM trial
    dat <- rwiener(n=1, alpha=true_alpha[i], tau=true_tau[i], beta=true_beta[i], delta=true_delta[i])
    
    # Encode choice in the RT sign: if choice is 'lower', make RT negative
    s_RT[i,j] <- ifelse(dat$resp == "upper", dat$q, -dat$q)
  }
}

# Run this in R to create the model file
cat("
model {
  for (i in 1:num_subs) {
    for (j in 1:num_trials) {
      # The Likelihood: This is the Wiener Diffusion process
      s_RT[i,j] ~ dwiener(alpha_iter[i], tau_iter[i], beta_iter[i], delta_iter[i])
    }

    # Individual-level Stochastic Priors (Non-Hierarchical)
    # These stay the same for every participant in Model 0
    alpha_iter[i] ~ dunif(1, 4)     # Boundary (Caution)
    tau_iter[i]   ~ dunif(0.01, 1)  # Non-decision time (Latency)
    beta_iter[i]  ~ dunif(0.1, 0.9) # Starting point (Bias)
    delta_iter[i] ~ dunif(-3, 3)    # Drift rate (Evidence)
  }
}
", file="model0.txt")



# Prepare data list for JAGS
jags_data <- list(
  s_RT = s_RT,
  num_subs = num_subs,
  num_trials = trials_per_sub
)

# Parameters we want to track
params <- c("alpha_iter", "tau_iter", "beta_iter", "delta_iter")

# Run JAGS
model_run <- jags(
  data = jags_data,
  parameters.to.save = params,
  model.file = "model0.txt",
  n.chains = 3,
  n.iter = 2000,
  n.burnin = 1000
)

# Print results
print(model_run)



# 1. Find the absolute fastest RT for each subject
# (We use abs() because DDM often codes choices as positive/negative RTs)
min_RT <- apply(abs(s_RT), 1, min, na.rm = TRUE)

# 2. Create a function that generates safe starting values for JAGS
my_inits <- function() {
  list(
    # Start alpha somewhere reasonable
    alpha_iter = runif(num_subs, 1.5, 2.5), 
    
    # CRITICAL: Start tau strictly below the subject's fastest RT
    # If their fastest RT is 0.250, this starts tau between 0.01 and 0.240
    tau_iter = runif(num_subs, 0.01, min_RT - 0.01), 
    
    # Start bias completely neutral
    beta_iter = runif(num_subs, 0.4, 0.6),
    
    # Start drift rate near zero
    delta_iter = runif(num_subs, -1, 1)
  )
}

# 3. Run JAGS and pass the safe inits!
model_run <- jags.model(
  file = "model0.txt", 
  data = jags_data, 
  inits = my_inits,  # <-- This prevents the crash!
  n.chains = 3, 
  n.adapt = 1000
)


# Extract means of the recovered parameters
recovered_alpha <- model_run$BUGSoutput$mean$alpha_iter

# Plotting Alpha Recovery
plot(true_alpha, recovered_alpha, 
     main="Parameter Recovery: Boundary (Alpha)",
     xlab="True Values", ylab="Recovered Values", 
     pch=19, col=rgb(0,0,1,0.5))
abline(0, 1, col="red", lwd=2) # The Identity Line (Perfect Recovery)

# Calculate Correlation
cor_val <- cor(true_alpha, recovered_alpha)
legend("topleft", legend=paste("Correlation =", round(cor_val, 3)))