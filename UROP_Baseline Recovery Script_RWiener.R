library(RWiener)

# 1. Create storage for recovered parameters (Alpha, Tau, Beta, Delta)
recovered_params <- matrix(NA, nrow = num_subs, ncol = 4)
colnames(recovered_params) <- c("alpha", "tau", "beta", "delta")

# 2. Loop through each sub and find the best-fitting parameters
cat("Starting Recovery for 200 subjects...\n")

for (i in 1:num_subs) {
  # Prepare this subject's data
  # RWiener needs a data.frame with columns 'q' and 'resp'
  sub_data <- data.frame(
    q = abs(s_RT[i,]), 
    resp = ifelse(s_RT[i,] > 0, "upper", "lower")
  )
  
  # wdm() is the core fitting function in RWiener
  # We use try() so that if one subject fails to converge, the whole loop doesn't stop
  fit <- try(wdm(sub_data), silent = TRUE)
  
  if (!inherits(fit, "try-error")) {
    # Extract: alpha (1), tau (2), beta (3), delta (4)
    recovered_params[i,] <- coef(fit)
  }
  
  if(i %% 20 == 0) cat("Processed Subject:", i, "\n")
}

# 3. Validation: Correlation check
# We remove any NAs if some subjects didn't converge
valid_idx <- which(!is.na(recovered_params[,1]))
cor_alpha <- cor(true_alpha[valid_idx], recovered_params[valid_idx, 1])

print(paste("Baseline Model 0 Recovery - Alpha Correlation:", round(cor_alpha, 3)))

# 4. Quick Plot to show your PI
plot(true_alpha[valid_idx], recovered_params[valid_idx, 1],
     main="Model 0 Recovery: Boundary (Alpha)",
     xlab="True Alpha", ylab="Recovered Alpha", pch=16, col="blue")
abline(0,1, col="red")


# Run these to get the other 3 plots - for Drift, Bias, and Non-decision
plot(true_tau, recovered_params[,2], main="Recovery: Non-Decision Time (Tau)")
plot(true_beta, recovered_params[,3], main="Recovery: Bias (Beta)")
plot(true_delta, recovered_params[,4], main="Recovery: Drift (Delta)")