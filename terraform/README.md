# Hospital Management System Infrastructure

This directory contains Terraform configuration for deploying the Hospital Management System infrastructure on AWS.

## Prerequisites

1. AWS CLI installed and configured with appropriate credentials
2. Terraform installed (version >= 1.2.0)
3. Docker installed (for building and pushing container images)

## Infrastructure Components

The Terraform configuration creates the following AWS resources:

- VPC with public and private subnets
- ECS Cluster with Fargate launch type
- Application Load Balancer
- RDS PostgreSQL database
- ECR repository for container images
- CloudWatch log groups
- IAM roles and policies
- Security groups

## Usage

1. Initialize Terraform:

```bash
terraform init
```

2. Create a `terraform.tfvars` file with your specific values:

```hcl
aws_region = "us-east-1"
environment = "dev"
db_username = "your_db_username"
db_password = "your_secure_password"
```

3. Review the planned changes:

```bash
terraform plan
```

4. Apply the configuration:

```bash
terraform apply
```

5. To destroy the infrastructure:

```bash
terraform destroy
```

## Important Notes

1. The database password should be kept secure and not committed to version control
2. The infrastructure is designed for development purposes. For production:
   - Consider using a larger RDS instance
   - Enable RDS backups
   - Configure SSL for the database
   - Use HTTPS for the load balancer
   - Consider using AWS Secrets Manager for sensitive data

## Outputs

After applying the configuration, you can get the following information:

- Load Balancer DNS name
- RDS endpoint
- ECR repository URL

Use `terraform output` to view these values.

## Maintenance

To update the infrastructure:

1. Make changes to the Terraform configuration files
2. Run `terraform plan` to review changes
3. Apply changes with `terraform apply`

## Security Considerations

- All resources are tagged with environment and project information
- Security groups are configured to allow only necessary traffic
- Private subnets are used for sensitive resources
- IAM roles follow the principle of least privilege
