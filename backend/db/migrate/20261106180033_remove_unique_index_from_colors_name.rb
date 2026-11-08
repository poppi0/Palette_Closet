class RemoveUniqueIndexFromColorsName < ActiveRecord::Migration[8.1]
  def change
    remove_index :colors, :name, unique: true
  end
end
