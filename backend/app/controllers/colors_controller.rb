class ColorsController < ApplicationController
  def index
    colors = Color.includes(:tone).order(:id).uniq(&:name)

    color_data = colors.map do |color|
      {
        id: color.id,
        name: color.name,
        hex_code: color.hex_code,
        tone: color.tone&.as_json(only: [ :id, :name ])
      }
    end

    render json: color_data
  end
end
