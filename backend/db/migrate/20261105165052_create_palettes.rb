class CreatePalettes < ActiveRecord::Migration[8.1]
  def change
    create_table :palettes, id: :integer do |t|
      t.references :base_color, type: :integer, null: false,
                   foreign_key: { to_table: :colors }
      t.references :sub_color, type: :integer, null: false,
                   foreign_key: { to_table: :colors }
      t.references :accent_color, type: :integer, null: false,
                   foreign_key: { to_table: :colors }

      t.integer :base_ratio, null: false
      t.integer :sub_ratio, null: false
      t.integer :accent_ratio, null: false

      t.timestamps
    end
  end
end
