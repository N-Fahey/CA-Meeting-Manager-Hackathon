resource "aws_ecr_repository" "app_ecr_repo" {
  name                 = var.aws_ecr_repo_name
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}