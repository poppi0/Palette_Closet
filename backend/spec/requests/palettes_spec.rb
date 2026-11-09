require "rails_helper"

RSpec.describe "GET /api/palettes", type: :request do
  let(:selected_color) { FactoryBot.create(:light_orange) }

  it "同じ分類名の色を含む配色を、該当割合が高い順に1件ずつ返す" do
    light_tone = selected_color.tone
    light_orange_base = FactoryBot.create(:light_orange, :base_sample, tone: light_tone)
    light_orange_sub = FactoryBot.create(:light_orange, :sub_sample, tone: light_tone)
    dull_orange = FactoryBot.create(:color, :dull_orange)
    red = FactoryBot.create(:color)
    blue = FactoryBot.create(:color, :blue, tone: red.tone)
    white = FactoryBot.create(:color, :white)

    accent_only_id = FactoryBot.create(
      :palette,
      base_color: red,
      sub_color: blue,
      accent_color: light_orange_base
    ).id

    sub_only_id = FactoryBot.create(
      :palette,
      base_color: red,
      sub_color: light_orange_base,
      accent_color: white
    ).id

    base_only_id = FactoryBot.create(
      :palette,
      base_color: light_orange_base,
      sub_color: blue,
      accent_color: white
    ).id

    base_and_sub_id = FactoryBot.create(
      :palette, :ratios_55_30_15,
      base_color: light_orange_base,
      sub_color: light_orange_sub,
      accent_color: dull_orange
    ).id

    FactoryBot.create(
      :palette,
      base_color: red,
      sub_color: blue,
      accent_color: white
    )

    get "/api/palettes", params: { color_id: selected_color.id }

    expect(response).to have_http_status(:ok)
    palettes = response.parsed_body

    expect(palettes.map { |palette| palette.fetch("id") })
      .to eq([ base_and_sub_id, base_only_id, sub_only_id, accent_only_id ])

    expect(palettes.first).to include(
      "base_color" => { "name" => "ライトオレンジ", "hex_code" => "#E4C6A6" },
      "base_ratio" => 55,
      "sub_color" => { "name" => "ライトオレンジ", "hex_code" => "#E6CD8C" },
      "sub_ratio" => 30,
      "accent_color" => { "name" => "ダルオレンジ", "hex_code" => "#8E775D" },
      "accent_ratio" => 15
    )
  end

  it "色が存在しても該当する配色がなければ空配列を返す" do
    get "/api/palettes", params: { color_id: selected_color.id }

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body).to eq([])
  end

  it "色IDが指定されていなければ400を返す" do
    get "/api/palettes"

    expect(response).to have_http_status(:bad_request)
  end

  it "色IDに数字以外が混ざっていれば400を返す" do
    get "/api/palettes", params: { color_id: "#{selected_color.id}abc" }

    expect(response).to have_http_status(:bad_request)
  end

  it "色IDが正の整数でも、その色が存在しなければ404を返す" do
    missing_color_id = Color.maximum(:id).to_i + 1

    get "/api/palettes", params: { color_id: missing_color_id }

    expect(response).to have_http_status(:not_found)
  end
end
