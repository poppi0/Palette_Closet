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
    Color.find_or_create_by!(name: "#{tone_name}#{color_name}") do |color|
      color.hex_code = hex_code
      color.tone = tone
    end
  end
end

{
  "ホワイト" => "#FFFFFF",
  "グレー" => "#808080",
  "ブラック" => "#000000"
}.each do |name, hex_code|
  Color.find_or_create_by!(name: name) do |color|
    color.hex_code = hex_code
  end
end
