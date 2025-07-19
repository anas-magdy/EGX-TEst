using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Brokers.Migrations
{
    /// <inheritdoc />
    public partial class addTableBroker : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Brokers",
                columns: table => new
                {
                    BROKER_CODE = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    BROKER_LONG_NAME = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BROKER_SHORT_NAME = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BROKER_NAME_ENG = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BROKER_ADDRESS = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BROK_TEL1 = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BROK_FAX = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SUSPENSION_CODE = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LAST_UPDATE_DATE = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Isdeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Brokers", x => x.BROKER_CODE);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Brokers");
        }
    }
}
