using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddingOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Grades_DivisionSubjects_DivisionSubjectId",
                table: "Grades");

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ParentId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_Parents_ParentId",
                        column: x => x.ParentId,
                        principalTable: "Parents",
                        principalColumn: "AppUserId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Orders_ParentId",
                table: "Orders",
                column: "ParentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Grades_DivisionSubjects_DivisionSubjectId",
                table: "Grades",
                column: "DivisionSubjectId",
                principalTable: "DivisionSubjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Grades_DivisionSubjects_DivisionSubjectId",
                table: "Grades");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.AddForeignKey(
                name: "FK_Grades_DivisionSubjects_DivisionSubjectId",
                table: "Grades",
                column: "DivisionSubjectId",
                principalTable: "DivisionSubjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
