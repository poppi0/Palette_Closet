FactoryBot.define do
  factory :palette do
    # 赤と青は同じトーンを参照する。
    base_color { association(:color) }
    sub_color { association(:color, :blue, tone: base_color.tone) }
    accent_color { association(:color, :white) }
    base_ratio { 60 }
    sub_ratio { 30 }
    accent_ratio { 10 }
  end
end
