require "json"

[
  "ペール", "ライト", "ブライト", "ビビッド",
  "ソフト", "ストロング", "ダル", "ディープ",
  "ライトグレイッシュ", "グレイッシュ",
  "ダークグレイッシュ", "ダーク"
].each do |name|
  Tone.find_or_create_by!(name: name)
end

color_names = [
  "レッド", "オレンジ", "イエロー",
  "グリーン", "ブルー", "パープル"
]

# 各行は、上の色名と同じ順番
tone_colors = {
  "ペール" => [
    "#EEDDDD", "#EEE6DD", "#EEEDDD",
    "#DDEEE0", "#DDE4EE", "#E8DDEE"
  ],
  "ライト" => [
    "#E9A0A0", "#E9C4A0", "#E9E3A0",
    "#A0E9AC", "#A0BEE9", "#D0A0E9"
  ],
  "ブライト" => [
    "#F15050", "#F1A150", "#F1E350",
    "#50F16B", "#5093F1", "#BB50F1"
  ],
  "ビビッド" => [
    "#F20D0D", "#F27F0D", "#F2DF0D",
    "#0DF233", "#0D6CF2", "#A60DF2"
  ],
  "ソフト" => [
    "#C89393", "#C8AD93", "#C8C393",
    "#93C89C", "#93A9C8", "#B693C8"
  ],
  "ストロング" => [
    "#C02626", "#C07326", "#C0B326",
    "#26C03F", "#2666C0", "#8C26C0"
  ],
  "ダル" => [
    "#A25353", "#A27A53", "#A29B53",
    "#53A260", "#5374A2", "#8753A2"
  ],
  "ディープ" => [
    "#821717", "#824C17", "#827917",
    "#178229", "#174482", "#5E1782"
  ],
  "ライトグレイッシュ" => [
    "#D1C2C2", "#D1C9C2", "#D1D0C2",
    "#C2D1C4", "#C2C8D1", "#CCC2D1"
  ],
  "グレイッシュ" => [
    "#A38585", "#A39485", "#A3A085",
    "#85A38A", "#8591A3", "#9985A3"
  ],
  "ダークグレイッシュ" => [
    "#5B4343", "#5B4F43", "#5B5943",
    "#435B47", "#434D5B", "#53435B"
  ],
  "ダーク" => [
    "#4B1B1B", "#4B331B", "#4B471B",
    "#1B4B23", "#1B2F4B", "#3B1B4B"
  ]
}

tone_colors.each do |tone_name, hex_codes|
  tone = Tone.find_by!(name: tone_name)

  color_names.zip(hex_codes).each do |color_name, hex_code|
    Color.find_or_create_by!(hex_code: hex_code) do |color|
      color.name = "#{tone_name}#{color_name}"
      color.tone = tone
    end
  end
end

{
  "ホワイト" => "#FFFFFF",
  "グレー" => "#808080",
  "ブラック" => "#000000"
}.each do |name, hex_code|
  Color.find_or_create_by!(hex_code: hex_code) do |color|
    color.name = name
  end
end

palette_data = JSON.parse(
  Rails.root.join("db/seeds/palette_data.json").read
)

ApplicationRecord.transaction do
  palette_data.fetch("colors").each do |row|
    Color.find_or_create_by!(hex_code: row["hex_code"]) do |color|
      color.name = row["name"]
      color.tone = Tone.find_by!(name: row["tone_name"]) if row["tone_name"]
    end
  end

  palette_data.fetch("palettes").each do |row|
    base = Color.find_by!(hex_code: row["base_hex"])
    sub = Color.find_by!(hex_code: row["sub_hex"])
    accent = Color.find_by!(hex_code: row["accent_hex"])
    ratios = [ row["base_ratio"], row["sub_ratio"], row["accent_ratio"] ]

    if [ base.id, sub.id, accent.id ].uniq.size != 3 || ratios.sum != 100
      raise "配色データを確認してください: #{row["source_id"]}"
    end

    Palette.find_or_create_by!(
      base_color: base,
      sub_color: sub,
      accent_color: accent,
      base_ratio: ratios[0],
      sub_ratio: ratios[1],
      accent_ratio: ratios[2]
    )
  end
end
