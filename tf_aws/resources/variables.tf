variable "aws_log_bucket_name" {
  description = "Name of the S3 bucket to store test run logs"
  type        = string
}

variable "aws_ecr_repo_name" {
  description = "Name of the ECR repository to store app containers"
  type        = string
}