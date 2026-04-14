resource "aws_secretsmanager_secret" "sm_mongo_uri" {
  name = "${var.project_name}-mongo-uri"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret" "sm_jwt_secret" {
  name = "${var.project_name}-jwt-secret"
  recovery_window_in_days = 0
}