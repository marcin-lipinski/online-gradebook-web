using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class DeleteParentDeleteOrders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Parents_ParentId",
                table: "Orders");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Parents_ParentId",
                table: "Orders",
                column: "ParentId",
                principalTable: "Parents",
                principalColumn: "AppUserId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Parents_ParentId",
                table: "Orders");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Parents_ParentId",
                table: "Orders",
                column: "ParentId",
                principalTable: "Parents",
                principalColumn: "AppUserId");
        }
    }
}
