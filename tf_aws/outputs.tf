output "log_bucket_arn" {
  value = module.resources.log_bucket_arn
}

output "ecr_repo_arn" {
  value = module.resources.ecr_repo_arn
}

output "ecr_repo_url" {
  value = module.resources.ecr_repo_url
}

output "ecs_cluster_arn" {
  value = module.resources.ecs_cluster_arn
}

output "sm_mongo_uri_secret_arn" {
  value = module.resources.sm_mongo_uri_secret_arn
}

output "sm_jwt_secret_arn" {
  value = module.resources.sm_jwt_secret_arn
}