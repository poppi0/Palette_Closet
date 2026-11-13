class PalettesController < ApplicationController
  def index
    color_id = search_params[:color_id]

    if valid_id?(color_id)
      selected_color = Color.find_by(id: color_id)
    else
      return head :bad_request
    end

    return head :not_found if selected_color.nil?

    palettes = Palette.search_by_color(selected_color)
    render json: palettes.map { |palette| palette_data(palette) }
  end

  def show
    palette_id = show_params[:id]

    if valid_id?(palette_id)
      palette = Palette.includes(:base_color, :sub_color, :accent_color)
                       .find_by(id: palette_id)
    else
      return head :bad_request
    end

    return head :not_found if palette.nil?

    render json: palette_data(palette)
  end

  private

  def search_params
    params.permit(:color_id)
  end

  def show_params
    params.permit(:id)
  end

  def valid_id?(id)
    id.is_a?(String) && id.match?(/\A[1-9][0-9]*\z/)
  end

  def palette_data(palette)
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
end
