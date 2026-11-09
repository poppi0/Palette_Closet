FactoryBot.define do
  # shortcut: カラーコードは固定。同じテストで同じ色を使う場合は作成済みのレコードを渡す。
  factory :color do
    name { "赤" }
    hex_code { "#FF0000" }
    association :tone

    trait :blue do
      name { "青" }
      hex_code { "#0000FF" }
    end

    trait :white do
      name { "白" }
      hex_code { "#FFFFFF" }
      tone { nil }
    end

    trait :dull_orange do
      name { "ダルオレンジ" }
      hex_code { "#8E775D" }
      association :tone, name: "ダル"
    end

    factory :light_orange do
      name { "ライトオレンジ" }
      hex_code { "#E9C4A0" }
      association :tone, name: "ライト"

      trait :base_sample do
        hex_code { "#E4C6A6" }
      end

      trait :sub_sample do
        hex_code { "#E6CD8C" }
      end
    end
  end
end
