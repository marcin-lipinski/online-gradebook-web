using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SubjectEdit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DivisionSubjects_Teachers_SubjectId",
                table: "DivisionSubjects");

            migrationBuilder.CreateIndex(
                name: "IX_DivisionSubjects_TeacherId",
                table: "DivisionSubjects",
                column: "TeacherId");

            migrationBuilder.AddForeignKey(
                name: "FK_DivisionSubjects_Teachers_TeacherId",
                table: "DivisionSubjects",
                column: "TeacherId",
                principalTable: "Teachers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DivisionSubjects_Teachers_TeacherId",
                table: "DivisionSubjects");

            migrationBuilder.DropIndex(
                name: "IX_DivisionSubjects_TeacherId",
                table: "DivisionSubjects");

            migrationBuilder.AddForeignKey(
                name: "FK_DivisionSubjects_Teachers_SubjectId",
                table: "DivisionSubjects",
                column: "SubjectId",
                principalTable: "Teachers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
