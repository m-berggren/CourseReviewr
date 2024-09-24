import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

// Create default admin if it does not exist
export const createDefaultAdmin = async () => {
    try {
        const adminExists = await User.findOne({role: 'admin'});
        if (!adminExists) {
            const adminPassword = 'admin123';
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            const adminUser = new User({
                username: 'admin',
                email: 'admin@courseradar.com',
                password: hashedPassword,
                role: 'admin'
            });
            await adminUser.save();
            console.log('Default admin user created', adminPassword);
        } else {
            console.log ('Admin user already exists, skipping default admin creation');
        }
    }catch(error){
        console.error('Error checking or creating admin user:', error);
    }
};