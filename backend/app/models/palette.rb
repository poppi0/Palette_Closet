class Palette < ApplicationRecord
  belongs_to :base_color, class_name: "Color"
  belongs_to :sub_color, class_name: "Color"
  belongs_to :accent_color, class_name: "Color"

  validates :base_ratio, :sub_ratio, :accent_ratio,
            numericality: {
              only_integer: true,
              greater_than_or_equal_to: 1,
              less_than_or_equal_to: 100
            }
end
