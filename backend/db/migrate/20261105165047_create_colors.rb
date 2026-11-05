class CreateColors < ActiveRecord::Migration[8.1]
  def change
    create_table :colors, id: :integer do |t|
      t.references :tone, type: :integer, null: true, foreign_key: true
      t.string :name, null: false
      t.string :hex_code, null: false

      t.timestamps
    end

    add_index :colors, :name, unique: true
    add_index :colors, :hex_code, unique: true
  end
end
