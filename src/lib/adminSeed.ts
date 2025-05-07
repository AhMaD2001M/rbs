import bcrypt from 'bcryptjs';
import User from '@/models/userModel';
import { connect } from './db';

export async function seedAdminUser() {
    try {
        await connect();

        // Check if admin already exists
        const existingAdmin = await User.findOne({ username: 'f2022065004' });
        
        if (!existingAdmin) {
            // Hash the admin password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('@vGP4hQ3', salt);

            // Create admin user
            const adminUser = new User({
                username: 'f2022065004',
                email: 'admin@rbs.edu',
                password: hashedPassword,
                role: 'admin',
                isVerified: true,
                profile: {
                    firstName: 'Admin',
                    lastName: 'User',
                }
            });

            await adminUser.save();
            console.log('Admin user seeded successfully');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
} 