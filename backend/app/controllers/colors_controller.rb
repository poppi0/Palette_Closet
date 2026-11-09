class ColorsController < ApplicationController
  def index
    colors = Color.includes(:tone).order(:id).uniq(&:name)

    render json: colors,
           only: [ :id, :name, :hex_code ],
           include: { tone: { only: [ :id, :name ] } }
  end
end
