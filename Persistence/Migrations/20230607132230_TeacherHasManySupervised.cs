using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class TeacherHasManySupervised : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Divisions_SupervisingTeacherId",
                table: "Divisions");

            migrationBuilder.DropColumn(
                name: "SupervisedDivisionId",
                table: "Teachers");

            migrationBuilder.CreateIndex(
                name: "IX_Divisions_SupervisingTeacherId",
                table: "Divisions",
                column: "SupervisingTeacherId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Divisions_SupervisingTeacherId",
                table: "Divisions");

            migrationBuilder.AddColumn<Guid>(
                name: "SupervisedDivisionId",
                table: "Teachers",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Divisions_SupervisingTeacherId",
                table: "Divisions",
                column: "SupervisingTeacherId",
                unique: true,
                filter: "[SupervisingTeacherId] IS NOT NULL");
        }
    }
}
