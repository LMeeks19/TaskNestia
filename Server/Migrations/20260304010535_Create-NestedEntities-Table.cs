using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskNestia.Server.Migrations
{
    /// <inheritdoc />
    public partial class CreateNestedEntitiesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Username",
                table: "Users",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Sheets",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateTable(
                name: "NestedEntities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SheetId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LastModified = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    SectionId = table.Column<int>(type: "int", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    IsComplete = table.Column<bool>(type: "bit", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NestedEntities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NestedEntities_NestedEntities_SectionId",
                        column: x => x.SectionId,
                        principalTable: "NestedEntities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_NestedEntities_Sheets_SheetId",
                        column: x => x.SheetId,
                        principalTable: "Sheets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Sheets_UserId",
                table: "Sheets",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_NestedEntities_Id",
                table: "NestedEntities",
                column: "Id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_NestedEntities_SectionId",
                table: "NestedEntities",
                column: "SectionId");

            migrationBuilder.CreateIndex(
                name: "IX_NestedEntities_SheetId",
                table: "NestedEntities",
                column: "SheetId");

            migrationBuilder.CreateIndex(
                name: "IX_NestedEntities_Type",
                table: "NestedEntities",
                column: "Type");

            migrationBuilder.AddForeignKey(
                name: "FK_Sheets_Users_UserId",
                table: "Sheets",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sheets_Users_UserId",
                table: "Sheets");

            migrationBuilder.DropTable(
                name: "NestedEntities");

            migrationBuilder.DropIndex(
                name: "IX_Sheets_UserId",
                table: "Sheets");

            migrationBuilder.AlterColumn<string>(
                name: "Username",
                table: "Users",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Sheets",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);
        }
    }
}
