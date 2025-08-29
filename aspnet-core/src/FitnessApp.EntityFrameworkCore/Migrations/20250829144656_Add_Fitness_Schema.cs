using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FitnessApp.Migrations
{
    /// <inheritdoc />
    public partial class Add_Fitness_Schema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "fit");

            migrationBuilder.CreateTable(
                name: "Equipments",
                schema: "fit",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Equipments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Exercises",
                schema: "fit",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    PrimaryMuscleId = table.Column<Guid>(type: "uuid", nullable: false),
                    Difficulty = table.Column<int>(type: "integer", nullable: false),
                    ExtraProperties = table.Column<string>(type: "text", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    DeleterId = table.Column<Guid>(type: "uuid", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Exercises", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MuscleGroups",
                schema: "fit",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    ParentId = table.Column<Guid>(type: "uuid", nullable: true),
                    ExtraProperties = table.Column<string>(type: "text", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MuscleGroups", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ExerciseEquipments",
                schema: "fit",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ExerciseId = table.Column<Guid>(type: "uuid", nullable: false),
                    EquipmentId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExerciseEquipments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExerciseEquipments_Equipments_EquipmentId",
                        column: x => x.EquipmentId,
                        principalSchema: "fit",
                        principalTable: "Equipments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ExerciseEquipments_Exercises_ExerciseId",
                        column: x => x.ExerciseId,
                        principalSchema: "fit",
                        principalTable: "Exercises",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ExerciseEquipments_EquipmentId",
                schema: "fit",
                table: "ExerciseEquipments",
                column: "EquipmentId");

            migrationBuilder.CreateIndex(
                name: "IX_ExerciseEquipments_ExerciseId_EquipmentId",
                schema: "fit",
                table: "ExerciseEquipments",
                columns: new[] { "ExerciseId", "EquipmentId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Exercises_PrimaryMuscleId",
                schema: "fit",
                table: "Exercises",
                column: "PrimaryMuscleId");

            migrationBuilder.CreateIndex(
                name: "IX_MuscleGroups_ParentId",
                schema: "fit",
                table: "MuscleGroups",
                column: "ParentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExerciseEquipments",
                schema: "fit");

            migrationBuilder.DropTable(
                name: "MuscleGroups",
                schema: "fit");

            migrationBuilder.DropTable(
                name: "Equipments",
                schema: "fit");

            migrationBuilder.DropTable(
                name: "Exercises",
                schema: "fit");
        }
    }
}
