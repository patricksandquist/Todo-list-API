Rails.application.routes.draw do
  namespace :api do
    resources :todos, except: [:new, :edit], defaults: {format: "json"}
  end

  root to: "static_pages#root"
end
