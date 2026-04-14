terraform {
  required_version = ">= 1.0.0"

  required_providers {

    aws = {
      source  = "hashicorp/aws"
      version = "6.37.0"
    }

    random = {
      source  = "hashicorp/random"
      version = "3.8.1"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "resources" {
  source              = "./resources"
  aws_log_bucket_name = var.aws_log_bucket_name
  aws_ecr_repo_name   = var.aws_ecr_repo_name
}