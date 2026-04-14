data "aws_iam_role" "ecs_task_execution_role" {
  name = "ecsTaskExecutionRole"
}

resource "aws_ecs_cluster" "ecs_cluster" {
  name = "${var.project_name}-cluster"

  tags = {
    Name      = var.project_name
    ManagedBy = "Terraform"
  }
}

resource "aws_ecs_task_definition" "ecs_td" {
  family                   = "${var.project_name}-td-family"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"

  # Resource allocation
  cpu    = 256 # 0.25 vCPU
  memory = 512 # 0.5 GB

  # Execution role
  execution_role_arn = data.aws_iam_role.ecs_task_execution_role.arn

  # Container definition
  container_definitions = jsonencode([
    {
      name      = var.project_name
      image     = "${aws_ecr_repository.app_ecr_repo.repository_url}:latest"
      essential = true

      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ]

      environment = [
        { name = "HOST", value = "0.0.0.0" },
        { name = "PORT", value = "3000" }
      ]
    }
  ])
}