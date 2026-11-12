require "rails_helper"

RSpec.describe "GET /api/palettes/:id", type: :request do
  it "指定した配色の3色と面積比率を返す" do
    first_palette = FactoryBot.create(:palette)

    palette = FactoryBot.create(
      :palette, :ratios_55_30_15,
      base_color: first_palette.base_color,
      sub_color: first_palette.sub_color,
      accent_color: first_palette.accent_color
    )

    get "/api/palettes/#{palette.id}"

    expect(response).to have_http_status(:ok)

    expect(response.parsed_body).to eq(
      "id" => palette.id,
      "base_color" => { "name" => "赤", "hex_code" => "#FF0000" },
      "base_ratio" => 55,
      "sub_color" => { "name" => "青", "hex_code" => "#0000FF" },
      "sub_ratio" => 30,
      "accent_color" => { "name" => "白", "hex_code" => "#FFFFFF" },
      "accent_ratio" => 15
    )
  end

  it "配色IDに数字以外が含まれていれば400を返す" do
    get "/api/palettes/abc"

    expect(response).to have_http_status(:bad_request)
  end

  it "存在する配色IDに文字が続いていれば400を返す" do
    palette = FactoryBot.create(:palette)

    get "/api/palettes/#{palette.id}abc"

    expect(response).to have_http_status(:bad_request)
  end

  it "配色IDが0なら400を返す" do
    get "/api/palettes/0"

    expect(response).to have_http_status(:bad_request)
  end

  it "配色IDが負の整数なら400を返す" do
    get "/api/palettes/-1"

    expect(response).to have_http_status(:bad_request)
  end

  it "配色IDが正の整数でも、その配色が存在しなければ404を返す" do
    missing_palette_id = Palette.maximum(:id).to_i + 1

    get "/api/palettes/#{missing_palette_id}"

    expect(response).to have_http_status(:not_found)
  end
end
