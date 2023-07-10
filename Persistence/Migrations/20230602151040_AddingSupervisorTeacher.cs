using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddingSupervisorTeacher : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "SupervisedDivisionId",
                table: "Teachers",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<string>(
                name: "SupervisingTeacherId",
                table: "Divisions",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Divisions_SupervisingTeacherId",
                table: "Divisions",
                column: "SupervisingTeacherId",
                unique: true,
                filter: "[SupervisingTeacherId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Divisions_Teachers_SupervisingTeacherId",
                table: "Divisions",
                column: "SupervisingTeacherId",
                principalTable: "Teachers",
                principalColumn: "AppUserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Divisions_Teachers_SupervisingTeacherId",
                table: "Divisions");

            migrationBuilder.DropIndex(
                name: "IX_Divisions_SupervisingTeacherId",
                table: "Divisions");

            migrationBuilder.DropColumn(
                name: "SupervisedDivisionId",
                table: "Teachers");

            migrationBuilder.DropColumn(
                name: "SupervisingTeacherId",
                table: "Divisions");
        }
    }
}
