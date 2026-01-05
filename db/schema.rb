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

ActiveRecord::Schema[8.1].define(version: 2025_12_30_094530) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "assessment_responses", force: :cascade do |t|
    t.bigint "assessment_session_id", null: false
    t.datetime "created_at", null: false
    t.integer "frame_index", null: false
    t.string "least_choice_key", null: false
    t.string "most_choice_key", null: false
    t.datetime "updated_at", null: false
    t.index ["assessment_session_id", "frame_index"], name: "index_assessment_responses_on_session_and_frame", unique: true
    t.index ["assessment_session_id"], name: "index_assessment_responses_on_assessment_session_id"
  end

  create_table "assessment_sessions", force: :cascade do |t|
    t.datetime "completed_at"
    t.datetime "created_at", null: false
    t.string "display_example_pro"
    t.string "example_pro_female"
    t.string "example_pro_male"
    t.string "first_name"
    t.string "gender", null: false
    t.integer "handicap"
    t.integer "least_c", default: 0
    t.integer "least_d", default: 0
    t.integer "least_i", default: 0
    t.integer "least_s", default: 0
    t.integer "most_c", default: 0
    t.integer "most_d", default: 0
    t.integer "most_i", default: 0
    t.integer "most_s", default: 0
    t.string "persona_code"
    t.string "persona_name"
    t.string "public_token", null: false
    t.integer "score_c"
    t.integer "score_d"
    t.integer "score_i"
    t.integer "score_s"
    t.datetime "started_at", null: false
    t.datetime "updated_at", null: false
    t.index ["public_token"], name: "index_assessment_sessions_on_public_token", unique: true
  end

  add_foreign_key "assessment_responses", "assessment_sessions"
end
