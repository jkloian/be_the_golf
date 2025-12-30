class CreateAssessmentResponses < ActiveRecord::Migration[8.1]
  def change
    create_table :assessment_responses do |t|
      t.references :assessment_session, null: false, foreign_key: true, index: true
      t.integer :frame_index, null: false
      t.string :most_choice_key, null: false
      t.string :least_choice_key, null: false

      t.timestamps
    end

    add_index :assessment_responses, [:assessment_session_id, :frame_index], unique: true, name: 'index_assessment_responses_on_session_and_frame'
  end
end

