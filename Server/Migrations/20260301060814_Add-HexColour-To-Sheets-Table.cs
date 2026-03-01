using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskNestia.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddHexColourToSheetsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "HexColour",
                table: "Sheets",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HexColour",
                table: "Sheets");
        }
    }
}
