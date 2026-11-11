class PalettesController < ApplicationController
  def index
    color_id = search_params[:color_id]

    if color_id.is_a?(String) && color_id.match?(/\A[1-9][0-9]*\z/)
      selected_color = Color.find_by(id: color_id)
    else
      return head :bad_request
    end

    if selected_color.nil?
      return head :not_found
    end

    color_ids = Color.where(name: selected_color.name).pluck(:id)

    palettes = Palette.where(base_color_id: color_ids)
                      .or(Palette.where(sub_color_id: color_ids))
                      .or(Palette.where(accent_color_id: color_ids))
                      .includes(:base_color, :sub_color, :accent_color)

    palettes = palettes.sort_by do |palette|
      matched_ratio = 0

      if color_ids.include?(palette.base_color_id)
        matched_ratio += palette.base_ratio
      end

      if color_ids.include?(palette.sub_color_id)
        matched_ratio += palette.sub_ratio
      end

      if color_ids.include?(palette.accent_color_id)
        matched_ratio += palette.accent_ratio
      end

      -matched_ratio
    end

    palette_data = palettes.map do |palette|
      {
        id: palette.id,
        base_color: palette.base_color.as_json(only: [ :name, :hex_code ]),
        base_ratio: palette.base_ratio,
        sub_color: palette.sub_color.as_json(only: [ :name, :hex_code ]),
        sub_ratio: palette.sub_ratio,
        accent_color: palette.accent_color.as_json(only: [ :name, :hex_code ]),
        accent_ratio: palette.accent_ratio
      }
    end

    render json: palette_data
  end

  private

  def search_params
    params.permit(:color_id)
  end
end
