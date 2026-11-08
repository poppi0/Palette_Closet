# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_11_06_180033) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "colors", id: :serial, force: :cascade do |t|
    t.integer "tone_id"
    t.string "name", null: false
    t.string "hex_code", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["hex_code"], name: "index_colors_on_hex_code", unique: true
    t.index ["tone_id"], name: "index_colors_on_tone_id"
  end

  create_table "palettes", id: :serial, force: :cascade do |t|
    t.integer "base_color_id", null: false
    t.integer "sub_color_id", null: false
    t.integer "accent_color_id", null: false
    t.integer "base_ratio", null: false
    t.integer "sub_ratio", null: false
    t.integer "accent_ratio", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["accent_color_id"], name: "index_palettes_on_accent_color_id"
    t.index ["base_color_id"], name: "index_palettes_on_base_color_id"
    t.index ["sub_color_id"], name: "index_palettes_on_sub_color_id"
  end

  create_table "tones", id: :serial, force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_tones_on_name", unique: true
  end

  add_foreign_key "colors", "tones"
  add_foreign_key "palettes", "colors", column: "accent_color_id"
  add_foreign_key "palettes", "colors", column: "base_color_id"
  add_foreign_key "palettes", "colors", column: "sub_color_id"
end
