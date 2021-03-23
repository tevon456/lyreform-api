# Data modeling

## Postgress solution

### Users

- user_id
- name
- email
- password
- verified
- active

### Forms

- form_id
- user_id
- published
- active
- allow_embed
- logo_path
- fields : jsonb<array>

### Form_Theme

- form_theme_id
- header_text_color
- header_background_color
- body_text_color
- body_background_color
- page_background_color
- control_text_color
- control_background_color
- form_id

### Submissions

- id
- formId
- fieldType
- label
- value jsonb<array>
- timestamp

### Roles

- role_id
- name

### Role_Has_Permissions

- role_id
- permission_id

### Permissions

- permission_id
- name
- description
