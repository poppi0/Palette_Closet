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
  end
end
