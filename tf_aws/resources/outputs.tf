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

output "sm_mongo_uri_secret_arn" {
  value = aws_secretsmanager_secret.sm_mongo_uri.arn
}

output "sm_jwt_secret_arn" {
  value = aws_secretsmanager_secret.sm_jwt_secret.arn
}