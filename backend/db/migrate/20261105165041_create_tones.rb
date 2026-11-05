class CreateTones < ActiveRecord::Migration[8.1]
  def change
    create_table :tones, id: :integer do |t|
      t.string :name, null: false

      t.timestamps
    end

    add_index :tones, :name, unique: true
  end
end
