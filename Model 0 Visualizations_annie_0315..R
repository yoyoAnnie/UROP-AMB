#The R Code for Model 0 Visualizations
#assumes your JAGS output is saved in an object called samples, 
#and you have your original true parameters saved as vectors (e.g., true_alpha, true_tau, etc.).

# ==========================================
# 1. TRACE PLOTS (Checking Convergence)
# ==========================================
# Plot the trace for the first subject's parameters to prove the chains mixed
plot(samples[, c("alpha_iter[1]", "tau_iter[1]", "beta_iter[1]", "delta_iter[1]")])


# ==========================================
# 2. EXTRACT RECOVERED PARAMETERS (Posterior Means)
# ==========================================
# Get the summary statistics from the JAGS MCMC chains
summary_jags <- summary(samples)

# Extract just the "Mean" column for all nodes
recovered_means <- summary_jags$statistics[, "Mean"]

# Separate the means back into vectors for each parameter
# (Assuming you have 200 subjects, adjust the numbers if your N is different)
num_subs <- 200 
rec_alpha <- recovered_means[grep("alpha_iter", names(recovered_means))]
rec_tau   <- recovered_means[grep("tau_iter", names(recovered_means))]
rec_beta  <- recovered_means[grep("beta_iter", names(recovered_means))]
rec_delta <- recovered_means[grep("delta_iter", names(recovered_means))]


# ==========================================
# 3. TRUE VS. RECOVERED SCATTER PLOTS
# ==========================================
# Set up a 2x2 grid for the 4 plots
par(mfrow = c(2, 2))

# 1. Boundary (Alpha)
plot(true_alpha, rec_alpha, main="Boundary (Alpha)", xlab="True", ylab="Recovered", pch=16, col="cyan3")
abline(a=0, b=1, col="blue4", lwd=2) # The perfect identity line

# 2. Non-Decision Time (Tau)
plot(true_tau, rec_tau, main="Non-Decision Time (Tau)", xlab="True", ylab="Recovered", pch=16, col="darkorchid3")
abline(a=0, b=1, col="blue4", lwd=2)

# 3. Bias (Beta)
plot(true_beta, rec_beta, main="Bias (Beta)", xlab="True", ylab="Recovered", pch=16, col="cornflowerblue")
abline(a=0, b=1, col="blue4", lwd=2)

# 4. Drift Rate (Delta)
plot(true_delta, rec_delta, main="Drift Rate (Delta)", xlab="True", ylab="Recovered", pch=16, col="darkgoldenrod1")
abline(a=0, b=1, col="blue4", lwd=2)

# Reset plotting grid
par(mfrow = c(1, 1))


