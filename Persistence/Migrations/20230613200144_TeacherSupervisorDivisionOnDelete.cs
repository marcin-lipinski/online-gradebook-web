﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class TeacherSupervisorDivisionOnDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Divisions_Teachers_SupervisingTeacherId",
                table: "Divisions");

            migrationBuilder.AddForeignKey(
                name: "FK_Divisions_Teachers_SupervisingTeacherId",
                table: "Divisions",
                column: "SupervisingTeacherId",
                principalTable: "Teachers",
                principalColumn: "AppUserId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Divisions_Teachers_SupervisingTeacherId",
                table: "Divisions");

            migrationBuilder.AddForeignKey(
                name: "FK_Divisions_Teachers_SupervisingTeacherId",
                table: "Divisions",
                column: "SupervisingTeacherId",
                principalTable: "Teachers",
                principalColumn: "AppUserId");
        }
    }
}
