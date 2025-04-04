terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.2.0"
}

provider "aws" {
  region = var.aws_region
}

# Tags for all resources
locals {
  common_tags = {
    Project     = "hospital-management"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}
