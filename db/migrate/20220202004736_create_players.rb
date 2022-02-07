class CreatePlayers < ActiveRecord::Migration[7.0]
  def change
    create_table :players do |t|
      t.string :username
      t.string :password_digest
      t.string :email
      t.string :bio
      t.string :avatar_url

      t.timestamps
    end
  end
end