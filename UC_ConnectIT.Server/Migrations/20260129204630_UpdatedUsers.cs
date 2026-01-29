using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UC_ConnectIT.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Used",
                table: "EmailVerificationTokens");

            migrationBuilder.RenameColumn(
                name: "FullName",
                table: "Users",
                newName: "LastName");

            migrationBuilder.RenameColumn(
                name: "ExpectedGraduation",
                table: "Users",
                newName: "GraduationDate");

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "LastName",
                table: "Users",
                newName: "FullName");

            migrationBuilder.RenameColumn(
                name: "GraduationDate",
                table: "Users",
                newName: "ExpectedGraduation");

            migrationBuilder.AddColumn<bool>(
                name: "Used",
                table: "EmailVerificationTokens",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
