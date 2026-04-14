output "log_bucket_arn" {
  value = aws_s3_bucket.log_bucket.arn
}

output "ecr_repo_arn" {
  value = aws_ecr_repository.app_ecr_repo.arn
}

output "ecr_repo_url" {
  value = aws_ecr_repository.app_ecr_repo.repository_url
}

output "ecs_cluster_arn" {
  value = aws_ecs_cluster.ecs_cluster.arn
}