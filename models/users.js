const headers = [
    { text: 'Имя', sortable: false, value: 'name' },
    { text: 'Телефон', sortable: false, value: 'phone' },
    { text: 'Email', sortable: false, value: 'email' },
    { text: 'Зарегистрирован', sortable: false, value: 'created_at' },
    { text: 'Последняя активность', sortable: false, value: 'aware_at' },
    { text: 'Действия', value: 'actions', sortable: false, width: 100 }
]


const defaultItem = {
    name: {
        value: '',
        type: 'string',
        rules: ['required'],
        name: 'Имя *'
    },
    phone: {
        value: '',
        type: 'number',
        rules: ['required', 'tel'],
        name: 'Email *'
    },
    email: {
        value: '',
        type: 'email',
        rules: ['required', 'email'],
        name: 'Email *'
    },
    password: {
        value: '',
        type: 'password',
        rules: ['required', 'minLength'],
        name: 'Пароль *'
    },
    id: {
        hide: true,
    }
}

export { headers, defaultItem }