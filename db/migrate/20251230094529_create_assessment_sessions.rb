class CreateAssessmentSessions < ActiveRecord::Migration[8.1]
  def change
    create_table :assessment_sessions do |t|
      t.string :public_token, null: false, index: { unique: true }
      t.string :first_name
      t.string :gender, null: false
      t.integer :handicap
      t.datetime :started_at, null: false
      t.datetime :completed_at

      # DISC scores (0-100)
      t.integer :score_d
      t.integer :score_i
      t.integer :score_s
      t.integer :score_c

      # Raw counts for debugging/analytics
      t.integer :most_d, default: 0
      t.integer :least_d, default: 0
      t.integer :most_i, default: 0
      t.integer :least_i, default: 0
      t.integer :most_s, default: 0
      t.integer :least_s, default: 0
      t.integer :most_c, default: 0
      t.integer :least_c, default: 0

      # Persona mapping
      t.string :persona_code
      t.string :persona_name
      t.string :example_pro_male
      t.string :example_pro_female
      t.string :display_example_pro

      t.timestamps
    end
  end
end
