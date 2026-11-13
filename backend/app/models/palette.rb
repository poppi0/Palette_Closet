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

  def self.search_by_color(selected_color)
    color_ids = Color.where(name: selected_color.name).pluck(:id)

    palettes = where(base_color_id: color_ids)
               .or(where(sub_color_id: color_ids))
               .or(where(accent_color_id: color_ids))
               .includes(:base_color, :sub_color, :accent_color)

    palettes.sort_by do |palette|
      -palette.matched_ratio(color_ids)
    end
  end

  def matched_ratio(color_ids)
    ratio = 0
    ratio += base_ratio if color_ids.include?(base_color_id)
    ratio += sub_ratio if color_ids.include?(sub_color_id)
    ratio += accent_ratio if color_ids.include?(accent_color_id)
    ratio
  end
end
