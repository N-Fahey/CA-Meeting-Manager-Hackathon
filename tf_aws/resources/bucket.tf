resource "random_id" "bucket_suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "log_bucket" {
  bucket = "${var.project_name}-log-bucket-${random_id.bucket_suffix.hex}"

  tags = {
    Name        = var.project_name
    Environment = "Dev"
    ManagedBy   = "Terraform"
  }
}

resource "aws_s3_bucket_public_access_block" "log_bucket" {
  bucket = aws_s3_bucket.log_bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "log_bucket" {
  bucket = aws_s3_bucket.log_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}