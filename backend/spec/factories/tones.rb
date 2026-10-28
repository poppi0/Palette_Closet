FactoryBot.define do
  # shortcut: 同じテストでは「ビビッド」を1件だけ作り、赤と青の両方で使い回す。2件作ると名前が重複する。
  factory :tone do
    name { "ビビッド" }
  end
end
