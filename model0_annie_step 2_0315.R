#The Fix: Smart Initial Values (inits)
#tell JAGS to always start guessing tau at a value that is strictly smaller than the absolute fastest RT for each subject.

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


#Run the MCMC Chains
# 1. The Burn-in Phase (Warm-up)
# This lets the MCMC chains find the high-probability space before recording.
cat("Starting Burn-in...\n")
update(model_run, n.iter = 1000)

# 2. The Sampling Phase
# We tell JAGS exactly which parameters we want to track and save.
cat("Recording Posterior Samples...\n")
params_to_track <- c("alpha_iter", "tau_iter", "beta_iter", "delta_iter")

samples <- coda.samples(
  model = model_run, 
  variable.names = params_to_track, 
  n.iter = 2000
)

cat("Sampling Complete!\n")


#Step 5: R-hat = check if the model actually converged (found the true answers). 
#Gelman-Rubin diagnostic (R-hat)
# Calculate R-hat for all parameters
gelman_diag <- gelman.diag(samples, multivariate = FALSE)

# Print a quick summary: Are the R-hat values close to 1.0?
print(gelman_diag)

#note, ideally, Point est. for  R-hat values to be under 1.1 (ideally 1.00 to 1.05).
# if so, = mathematically valid Baseline Model 0. if over 1.2, it means the chains haven't mixed yet, and we just need to increase n.iter (run it longer).
