using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class DatabaseRepeair : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Grades_DivisionSubjects_DivisionSubjetId",
                table: "Grades");

            migrationBuilder.RenameColumn(
                name: "DivisionSubjetId",
                table: "Grades",
                newName: "DivisionSubjectId");

            migrationBuilder.RenameIndex(
                name: "IX_Grades_DivisionSubjetId",
                table: "Grades",
                newName: "IX_Grades_DivisionSubjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_Grades_DivisionSubjects_DivisionSubjectId",
                table: "Grades",
                column: "DivisionSubjectId",
                principalTable: "DivisionSubjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Grades_DivisionSubjects_DivisionSubjectId",
                table: "Grades");

            migrationBuilder.RenameColumn(
                name: "DivisionSubjectId",
                table: "Grades",
                newName: "DivisionSubjetId");

            migrationBuilder.RenameIndex(
                name: "IX_Grades_DivisionSubjectId",
                table: "Grades",
                newName: "IX_Grades_DivisionSubjetId");

            migrationBuilder.AddForeignKey(
                name: "FK_Grades_DivisionSubjects_DivisionSubjetId",
                table: "Grades",
                column: "DivisionSubjetId",
                principalTable: "DivisionSubjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
